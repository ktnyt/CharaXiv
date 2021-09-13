import { TextArea } from './TextArea'
import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import copy from 'copy-to-clipboard'
import {
  convertFromRaw,
  convertToRaw,
  DraftBlockType,
  DraftEditorCommand,
  Editor as DraftEditor,
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  RawDraftContentState,
  RichUtils,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import { draftjsToMd, mdToDraftjs } from 'draftjs-md-converter'
import PluginEditor from '@draft-js-plugins/editor'
import linkifyPlugin from '@draft-js-plugins/linkify'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import {
  faBold,
  faCopy,
  faHeading,
  faItalic,
  faListOl,
  faListUl,
  faQuoteLeft,
  faUnderline,
  faWindowClose,
} from '@fortawesome/free-solid-svg-icons'
import { useDebounce } from '@/hooks/useDebounce'
import { useStyles } from '@/hooks/useStyles'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { IconButton } from './IconButton'
import { InputGroup } from './InputGroup'
import { InputSet } from './InputSet'
import { Modal } from './Modal'
import styles from './Editor.module.sass'

type KeyBindingFunction = NonNullable<DraftEditor['props']['keyBindingFn']>
type HandleKeyCommand = NonNullable<DraftEditor['props']['handleKeyCommand']>

const BLOCK_TYPES = [
  { key: 'blockquote', icon: faQuoteLeft },
  { key: 'unordered-list-item', icon: faListUl },
  { key: 'ordered-list-item', icon: faListOl },
]

const INLINE_STYLES = [
  { key: 'BOLD', icon: faBold },
  { key: 'ITALIC', icon: faItalic },
  { key: 'UNDERLINE', icon: faUnderline },
]

const toggleBlockTypeCommandPrefix = 'toggle-block-type-'

const toggleBlockTypeCommand = (blockType: DraftBlockType) =>
  `${toggleBlockTypeCommandPrefix}${blockType}`

const initEditorState = (raw?: RawDraftContentState): EditorState => {
  if (raw) {
    const content = convertFromRaw(raw)
    return EditorState.createWithContent(content)
  }
  return EditorState.createEmpty()
}

interface EditorProps {
  placeholder?: string
  defaultValue?: any
  disabled?: boolean
  onChange?: (raw: RawDraftContentState) => void
}

export const Editor = ({
  placeholder,
  defaultValue,
  disabled = false,
  onChange,
}: EditorProps) => {
  const editorRef = useRef<PluginEditor>(null!)
  const focusEditor = () => {
    if (!disabled) {
      editorRef.current.focus()
    }
  }

  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const [currentState, setCurrentState] = useState(
    initEditorState(defaultValue),
  )
  const currentContent = currentState.getCurrentContent()
  useUpdateEffect(() => {
    const raw = convertToRaw(currentContent)
    if (onChangeRef.current) onChangeRef.current(raw)
  }, [currentContent])

  const toggleCurrentBlockType =
    (blockType: string) =>
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault()
      const nextState = RichUtils.toggleBlockType(currentState, blockType)
      setCurrentState(nextState)
    }

  const currentBlockType = () => {
    const selection = currentState.getSelection()
    const content = currentState.getCurrentContent()
    const block = content.getBlockForKey(selection.getFocusKey())
    return block.getType()
  }

  const toggleCurrentInlinStyle =
    (inlineStyle: string) =>
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault()
      const nextState = RichUtils.toggleInlineStyle(currentState, inlineStyle)
      setCurrentState(nextState)
    }

  const getCurrentInlineStyle = () => currentState.getCurrentInlineStyle()

  const handleKeyCommand: HandleKeyCommand = (command, editorState) => {
    if (command === 'clear-block-style') {
      const nextContent = RichUtils.tryToRemoveBlockStyle(editorState)
      if (nextContent) {
        const nextState = EditorState.push(
          editorState,
          nextContent,
          'change-block-type',
        )
        setCurrentState(nextState)
        return 'handled'
      }
    }

    if (command.startsWith(toggleBlockTypeCommandPrefix)) {
      const blockType = command.slice(toggleBlockTypeCommandPrefix.length)
      const nextState = RichUtils.toggleBlockType(editorState, blockType)
      setCurrentState(nextState)
      return 'handled'
    }

    const nextState = RichUtils.handleKeyCommand(
      editorState,
      command as DraftEditorCommand,
    )
    if (nextState) {
      setCurrentState(nextState)
    }

    return 'not-handled'
  }

  const keyBindingFunction: KeyBindingFunction = (event) => {
    if (event.code === 'Backspace' || event.code === 'Enter') {
      const selection = currentState.getSelection()
      const focus = selection.getFocusOffset()
      const anchor = selection.getAnchorOffset()
      if (currentBlockType() !== 'unstyled' && anchor === 0 && focus === 0) {
        return 'clear-block-style'
      }
    }

    const isCmd = KeyBindingUtil.usesMacOSHeuristics()
      ? event.metaKey
      : event.ctrlKey

    if (event.altKey && isCmd) {
      switch (event.code) {
        case 'Digit0':
          return toggleBlockTypeCommand('unstyled')
        case 'Digit1':
          return toggleBlockTypeCommand('header-one')
        case 'Digit2':
          return toggleBlockTypeCommand('header-two')
        case 'Digit3':
          return toggleBlockTypeCommand('header-three')
        case 'Digit4':
          return toggleBlockTypeCommand('header-four')
        case 'Digit5':
          return toggleBlockTypeCommand('header-five')
        case 'Digit6':
          return toggleBlockTypeCommand('header-six')
      }
    }

    if (event.shiftKey && isCmd) {
      switch (event.code) {
        case 'Digit7':
          return toggleBlockTypeCommand('ordered-list-item')
        case 'Digit8':
          return toggleBlockTypeCommand('unordered-list-item')
        case 'Digit9':
          return toggleBlockTypeCommand('blockquote')
      }
    }

    return getDefaultKeyBinding(event)
  }

  const [markdown, setMarkdown] = useState('')
  const [openMarkdown, setOpenMarkdown] = useState(false)
  const debounceMarkdown = useDebounce(markdown, { delay: 500 })
  const debounceOpenMarkdown = useDebounce(openMarkdown, { delay: 500 })
  const debounceOpenMarkdownRef = useRef(openMarkdown)
  const copyMarkdown = () => {
    copy(markdown, { format: 'text/plain' })
    toast.success('マークダウンテキストをコピーしました。')
  }

  useEffect(() => {
    debounceOpenMarkdownRef.current = debounceOpenMarkdown
  }, [debounceOpenMarkdown])

  useEffect(() => {
    const raw = convertToRaw(currentContent)
    const markdown = draftjsToMd(raw)
    setMarkdown(markdown)
  }, [currentContent])

  useEffect(() => {
    if (debounceOpenMarkdownRef.current) {
      const raw = mdToDraftjs(debounceMarkdown)
      const content = convertFromRaw(raw)
      const nextState = EditorState.createWithContent(content)
      setCurrentState(nextState)
    }
  }, [debounceMarkdown])

  const [focused, setFocused] = useState(false)

  const classes = useStyles(styles)

  return (
    <div className={classes.container} onClick={focusEditor}>
      {!disabled && (
        <div className={classes.controls}>
          <InputGroup>
            <InputSet>
              <IconButton
                icon={faHeading}
                onMouseDown={(event) => event.preventDefault()}
                onClick={toggleCurrentBlockType('header-one')}
                variant="default"
                color={
                  currentBlockType().startsWith('header-') && focused
                    ? 'primary'
                    : 'light'
                }
                disabled={!focused}
              />

              {BLOCK_TYPES.map(({ key, icon }) => (
                <IconButton
                  key={key}
                  icon={icon}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={toggleCurrentBlockType(key)}
                  variant="default"
                  color={
                    currentBlockType() === key && focused ? 'primary' : 'light'
                  }
                  disabled={!focused}
                />
              ))}
            </InputSet>

            <InputSet>
              {INLINE_STYLES.map(({ key, icon }) => (
                <IconButton
                  key={key}
                  icon={icon}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={toggleCurrentInlinStyle(key)}
                  variant="default"
                  color={
                    getCurrentInlineStyle().has(key) && focused
                      ? 'primary'
                      : 'light'
                  }
                  disabled={!focused}
                />
              ))}
            </InputSet>

            <IconButton
              icon={faMarkdown}
              variant="default"
              color="light"
              onClick={() => setOpenMarkdown(true)}
            />
          </InputGroup>
        </div>
      )}

      <Modal open={openMarkdown} handleClose={() => setOpenMarkdown(false)}>
        <div className={classes.markdown}>
          <div>
            <TextArea
              defaultValue={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
            />
          </div>

          <div>
            <InputGroup>
              <IconButton
                variant="outline"
                color="primary"
                icon={faCopy}
                onClick={copyMarkdown}
              />

              <IconButton
                variant="textual"
                color="danger"
                icon={faWindowClose}
                onClick={() => setOpenMarkdown(false)}
              />
            </InputGroup>
          </div>
        </div>
      </Modal>

      <div className={clsx(classes.editor, disabled && classes.disabled)}>
        <PluginEditor
          ref={editorRef}
          placeholder={focused ? '' : placeholder}
          editorState={currentState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFunction}
          onChange={setCurrentState}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          plugins={[linkifyPlugin()]}
          readOnly={disabled}
        />
      </div>
    </div>
  )
}
