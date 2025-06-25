import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChartLine,
  faUsers,
  faBoxes,
  faPlusCircle,
  faEdit
} from '@fortawesome/free-solid-svg-icons';

export function setupFontAwesome() {
  library.add(faChartLine, faUsers, faBoxes, faPlusCircle, faEdit);
}
