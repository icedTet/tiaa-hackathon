import { Switch as Switchy } from '@headlessui/react'
export const Switch = (props: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  experimental?: boolean
  disabled?: boolean
  className?: string
}) => {
  const { label, checked, onChange, experimental, disabled, className } = props

  return (
    <Switchy.Group>
      <div className={`flex items-center ${className}`}>
        <Switchy.Label className="flex flex-row items-center gap-2 mr-4 text-gray-600 dark:text-gray-300">
          {/* {' '}
        Plugins{' '}
        <div className={`bg-pink-500 dark:bg-fuchsia-400 text-white text-xs rounded-full px-2 py-1`}>
          Experimental
        </div> */}
          {label}&nbsp;
          {experimental && (
            <div className={`bg-pink-500 dark:bg-fuchsia-400 text-white text-xs rounded-full px-2 py-1`}>
              Experimental
            </div>
          )}
        </Switchy.Label>

        <Switchy
          checked={checked}
          onChange={() => {
            onChange(!checked)
          }}
          disabled={disabled}
          className={` ${
            checked
              ? `bg-indigo-500 bg-opacity-80`
              : 'bg-gray-300 dark:bg-gray-700'
          } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none shadow-inner`}
        >
          <span
            className={`${
              checked ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow`}
          />
        </Switchy>
      </div>
    </Switchy.Group>
  )
}
