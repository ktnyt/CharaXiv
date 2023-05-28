import { Component } from 'solid-js'
import { ColorKey } from '../styles/color'

export type IconProps = {
  style: 'solid'
  color?: 'default' | 'light' | 'medium' | 'dark' | ColorKey
}

export const Icon: Component = () => {
  return <i class="fa-solid fa-moon"></i>
}
