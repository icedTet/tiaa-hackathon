export const PrimaryButton = (props: {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
  id?: string
  ref?: React.Ref<HTMLButtonElement>
  color?: string
}) => {
  const col = props.color ?? 'primary-500' 
  return (
    <button
      className={`${props.className} bg-${col} hover:shadow-lg drop-shadow-none hover:brightness-125 text-sm p-2 transition-all disabled:opacity-50 cursor-pointer rounded-xl px-4 text-white`}
      onClick={props.onClick}
      disabled={props.disabled}
      id={props.id}
      ref={props.ref}
    >
      {props.children}
    </button>
  )
}
