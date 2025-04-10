import type { CalendarDayFieldMeta, Value } from '@keystone-6/core/dist/declarations/src/fields/types/calendarDay/views'
import type { FieldController, FieldControllerConfig, FieldProps } from '@keystone-6/core/types'
import type { ChangeEvent } from 'react'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import React, { useEffect, useRef } from 'react'

export function Field({ field, value, onChange }: FieldProps<typeof controller>) {
  const dateInput = useRef<HTMLInputElement | null>(null)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value).toISOString() : null
    if (onChange) {
      onChange({ ...value, value: newDate })
    }
  }
  useEffect(() => {
    if (dateInput.current && value.value) {
      const localeString = new Date(value.value)
      localeString.setMilliseconds(0)
      dateInput.current.valueAsNumber = localeString.getTime() - localeString.getTimezoneOffset() * 60 * 1000
    }
  }, [value])

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <input
        type="datetime-local"
        ref={dateInput}
        onInput={handleChange}
        onChange={handleChange}
        className="html-date-picker"
      />
    </FieldContainer>
  )
}

function validate(
  value: Value,
  fieldMeta: CalendarDayFieldMeta,
  label: string,
): string | undefined {
  if (value.kind === 'update' && value.initial === null && value.value === null) {
    return undefined
  }

  if (fieldMeta.isRequired && value.value === null) {
    return `${label} is required`
  }
  return undefined
}

export function controller(
  config: FieldControllerConfig<CalendarDayFieldMeta>,
): FieldController<Value, string> & { fieldMeta: CalendarDayFieldMeta } {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    fieldMeta: config.fieldMeta,
    defaultValue: { kind: 'create', value: null },
    deserialize: (data) => {
      const value = data[config.path]
      return { kind: 'update', initial: value, value }
    },
    serialize: ({ value }) => {
      return { [config.path]: value }
    },
    validate: value => validate(value, config.fieldMeta, config.label) === undefined,
  }
}
