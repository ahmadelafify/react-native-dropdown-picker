import DropDownPicker from './src/components/Picker';
import { DROPDOWN_DIRECTION, LIST_MODE } from './src/constants';
import type {
  DropDownDirectionType,
  ListModeType,
} from './src/constants';
import type {
  DropDownPickerProps,
  MultipleText,
  RenderListItemPropsInterface,
} from './src/components/Picker';
import type { ItemType, ValueType } from './src/components/RenderListItem';

(DropDownPicker as any).LIST_MODE = LIST_MODE;
(DropDownPicker as any).setListMode = (mode: ListModeType): void => {
  LIST_MODE.DEFAULT = mode;
};

(DropDownPicker as any).DROPDOWN_DIRECTION = DROPDOWN_DIRECTION;
(DropDownPicker as any).setDropDownDirection = (direction: DropDownDirectionType): void => {
  DROPDOWN_DIRECTION.DEFAULT = direction;
};

export default DropDownPicker;
export {
  DROPDOWN_DIRECTION,
  LIST_MODE,
};
export type {
  DropDownDirectionType,
  DropDownPickerProps,
  ItemType,
  ListModeType,
  MultipleText,
  RenderListItemPropsInterface,
  ValueType,
};
