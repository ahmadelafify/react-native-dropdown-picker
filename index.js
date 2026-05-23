import Picker from './src/components/Picker';
import { DROPDOWN_DIRECTION, LIST_MODE } from './src/constants';

Picker.LIST_MODE = LIST_MODE;
Picker.setListMode = mode => {
  Picker.LIST_MODE.DEFAULT = mode;
};

Picker.DROPDOWN_DIRECTION = DROPDOWN_DIRECTION;
Picker.setDropDownDirection = direction => {
  Picker.DROPDOWN_DIRECTION.DEFAULT = direction;
};

export default Picker;
