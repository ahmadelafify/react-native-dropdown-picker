import { ScaledSheet, moderateScale, verticalScale, scale } from 'react-native-size-matters';
import Colors from '../../constants/colors';

export const ICONS = {
  ARROW_DOWN: require('./icons/arrow-down.png'),
  ARROW_UP: require('./icons/arrow-up.png'),
  TICK: require('./icons/tick.png'),
  CLOSE: require('./icons/close.png'),
};

export default ScaledSheet.create({
  arrowIcon: {
    height: moderateScale(20),
    width: moderateScale(20),
  },
  arrowIconContainer: {
    marginLeft: moderateScale(10),
  },
  badgeDotStyle: {
    backgroundColor: Colors.GREY,
    borderRadius: moderateScale(5),
    height: moderateScale(10),
    marginRight: moderateScale(8),
    width: moderateScale(10),
  },
  badgeSeparator: {
    width: moderateScale(5),
  },
  badgeStyle: {
    alignItems: 'center',
    backgroundColor: Colors.ALTO,
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
  },
  closeIcon: {
    height: moderateScale(30),
    width: moderateScale(30),
  },
  closeIconContainer: {
    marginLeft: moderateScale(10),
  },
  container: {
    width: '100%',
  },
  customItemContainer: {},
  customItemLabel: {
    fontStyle: 'italic',
  },
  dropDownContainer: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.BLACK,
    borderRadius: moderateScale(8),
    borderWidth: scale(1),
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
  },
  extendableBadgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  extendableBadgeItemContainer: {
    marginEnd: moderateScale(7),
    marginVertical: moderateScale(3),
  },
  flatListContentContainer: {
    flexGrow: 1,
  },
  iconContainer: {
    marginRight: moderateScale(10),
  },
  itemSeparator: {
    backgroundColor: Colors.BLACK,
    height: scale(1),
  },
  label: {
    color: Colors.BLACK,
    flex: 1,
    fontSize: moderateScale(12),
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listBody: {
    height: '100%',
  },
  listBodyContainer: {
    alignItems: 'center',
    flexGrow: 1,
  },
  listChildContainer: {
    paddingLeft: moderateScale(40),
  },
  listChildLabel: {},
  listItemContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.SHUTTLE_GREY,
    flexDirection: 'row',
    height: moderateScale(50),
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(10),
  },
  listItemLabel: {
    color: Colors.BLACK,
    flex: 1,
    fontSize: moderateScale(12),
  },
  listMessageContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: moderateScale(10),
  },
  listMessageText: {},
  listParentContainer: {},
  listParentLabel: {},
  modalContentContainer: {
    flexGrow: 1,
  },
  modalTitle: {
    color: Colors.BLACK,
    fontSize: moderateScale(18),
  },
  searchContainer: {
    alignItems: 'center',
    borderBottomColor: Colors.BLACK,
    borderBottomWidth: scale(1),
    flexDirection: 'row',
    padding: moderateScale(10),
  },
  searchTextInput: {
    borderColor: Colors.BLACK,
    borderRadius: moderateScale(8),
    borderWidth: scale(1),
    color: Colors.BLACK,
    flexGrow: 1,
    flexShrink: 1,
    margin: 0,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    fontSize: moderateScale(14),
  },
  selectedItemContainer: {},
  selectedItemLabel: {},
  style: {
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderColor: Colors.BLACK,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: moderateScale(46),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(3),
    width: '100%',
  },
  tickIcon: {
    height: moderateScale(20),
    width: moderateScale(20),
  },
  tickIconContainer: {
    marginLeft: moderateScale(10),
  },
});
