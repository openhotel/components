import * as React from "react";

// @ts-ignore
import styles from "./selector.module.scss";
import { cn } from "../../../utils";
import { useCallback, useRef, useState } from "react";
import {
  ChevronDownIconComponent,
  CrossIconComponent,
  BoxComponent,
  BoxProps,
} from "../../../components";

type Option = {
  key: string | number;
  value: React.ReactNode;
};

type Props = {
  name?: string;
  placeholder?: string;
  className?: string;
  bordered?: boolean;
  defaultOption?: Option | string;
  options: Option[];
  onChange?: (option: Option) => void;
} & Partial<BoxProps>;

export const SelectorComponent: React.FC<Props> = ({
  name,
  placeholder,
  className,
  bordered,
  options,
  defaultOption,
  onChange = () => {},
  ...boxProps
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(() =>
    typeof defaultOption === "string"
      ? (options.find((o) => o.key === defaultOption) ?? null)
      : defaultOption,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onChangeValue = useCallback(
    (option: Option) => () => {
      setSelectedOption(option);
      onChange(option);
      setIsOpen(false);
    },
    [setSelectedOption, onChange, setIsOpen],
  );

  const onClickClear = useCallback(() => {
    setSelectedOption(null);
    onChange(null);
    setIsOpen(false);
  }, [setSelectedOption, onChange, setIsOpen]);

  const inputRef = useRef<HTMLInputElement>();
  const closeRef = useRef<HTMLInputElement>();
  const modalRef = useRef<HTMLInputElement>();

  const onToggleOptions = useCallback(
    (event) => {
      if (closeRef.current && closeRef.current.contains(event.target)) return;
      setIsOpen((isOpen) => !isOpen);
    },
    [setIsOpen],
  );

  const onContextClick = useCallback(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <BoxComponent
      onClick={onContextClick}
      className={cn(
        styles.selector,
        className,
        [styles.bordered, !!bordered],
        [styles.isOpen, isOpen],
      )}
      {...boxProps}
    >
      <div onClick={onToggleOptions} className={cn(styles.select)}>
        <input
          ref={inputRef}
          name={name}
          className={styles.input}
          defaultValue={selectedOption?.key}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsOpen((isOpen) => !isOpen);
              e.preventDefault();
            }
          }}
          onBlur={(e) => {
            if (
              modalRef.current &&
              modalRef.current.contains(e.relatedTarget)
            ) {
              return;
            }
            setIsOpen(false);
          }}
        />

        {selectedOption ? (
          <label className={styles.selection}>{selectedOption?.value}</label>
        ) : (
          <label className={styles.placeholder}>{placeholder}</label>
        )}

        {selectedOption ? (
          <div ref={closeRef} className={styles.clear} onClick={onClickClear}>
            <CrossIconComponent />
          </div>
        ) : null}
        <div className={styles.chevron}>
          <ChevronDownIconComponent />
        </div>
      </div>

      {isOpen ? (
        <div ref={modalRef} className={styles.modal}>
          <div className={styles.options}>
            {options.map((option) => (
              <button
                key={option.key}
                type="button"
                className={cn(styles.option, [
                  styles.optionSelected,
                  option.key === selectedOption?.key,
                ])}
                onClick={onChangeValue(option)}
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </BoxComponent>
  );
};
