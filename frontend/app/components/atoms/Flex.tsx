import { ComponentPropsWithRef, CSSProperties, forwardRef } from 'react'

export type FlexProps = ComponentPropsWithRef<'div'> & {
  column?: boolean
  backward?: boolean
  wrap?: boolean
  reverse?: boolean
  justifyContent?: CSSProperties['justifyContent']
  alignItems?: CSSProperties['alignItems']
  alignContent?: CSSProperties['alignContent']
  order?: number
  grow?: number
  shrink?: number
  basis?: CSSProperties['flexBasis']
  alignSelf?: CSSProperties['alignSelf']
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      column,
      backward,
      wrap,
      reverse,
      justifyContent,
      alignItems,
      alignContent,
      order,
      grow: flexGrow,
      shrink: flexShrink,
      basis: flexBasis,
      alignSelf,
      ...props
    },
    ref,
  ) => (
    <div
      style={{
        display: 'flex',
        flexDirection: column
          ? backward
            ? 'column-reverse'
            : 'column'
          : backward
          ? 'row-reverse'
          : 'row',
        flexWrap: wrap ? (reverse ? 'wrap-reverse' : 'wrap') : 'nowrap',
        justifyContent,
        alignItems,
        alignContent,
        order,
        flexGrow,
        flexShrink,
        flexBasis,
        alignSelf,
      }}
      ref={ref}
      {...props}
    />
  ),
)

Flex.displayName = 'Flex'
