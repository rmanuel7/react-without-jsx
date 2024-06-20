/**
 * ES6 Class
 */
/* eslint-disable no-undef */
import FileForm from './components/FileForm';
import ListUploadFile from './components/ListUploadFile';
import MetodoForm from './components/MetodoForm';
import Stepper from './components/Stepper';

export default class App extends React.Component {
    render() {
        const steps = [
            MetodoForm,
            FileForm,
            ListUploadFile
        ];

        return React.createElement(
            Stepper, { steps },
            []
        );
    }
}
