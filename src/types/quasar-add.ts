
export interface TableCellSlotScope {
  value: unknown
  row: unknown
}

export interface SelectOptionScope {
  /**
   * Option index
   */
  index: number;
  /**
   * Option -- its value is taken from 'options' prop
   */
  opt: any;
  /**
   * Is option selected?
   */
  selected: boolean;
  /**
   * Is option focused?
   */
  focused: boolean;
  /**
   * Add/remove option from model
   * @param opt Option to add to model
   */
  toggleOption: (opt: any) => void;
  /**
   * Sets option from menu as 'focused'
   * @param index Index of option from menu
   */
  setOptionIndex: (index: number) => void;
  /**
   * Computed properties passed down to QItem
   */
  itemProps: any;
}

export interface SelectSelectedItemScope {
  /**
   * Selection index
   */
  index: number;
  /**
   * Selected option -- its value is taken from model
   */
  opt: any;
  /**
   * Always true -- passed down as prop to QItem (when using QItem)
   */
  selected: boolean;
  /**
   * Remove selected option located at specific index
   * @param index Index at which to remove selection
   */
  removeAtIndex: (index: number) => void;
  /**
   * Add/remove option from model
   * @param opt Option to add to model
   */
  toggleOption: (opt: any) => void;
  /**
   * Tabindex HTML attribute value associated with respective option
   */
  tabindex: number;
}

export type InputFieldType = "text"
  | "password"
  | "textarea"
  | "email"
  | "search"
  | "tel"
  | "file"
  | "number"
  | "url"
  | "time"
  | "date"

