import { Component, h } from 'preact';
import DoFingerprint3DS2 from './DoFingerprint3DS2';
import { createFingerprintResolveData, handleErrorCode, prepareFingerPrintData } from '../utils';
import { PrepareFingerprint3DS2Props, PrepareFingerprint3DS2State } from './types';
import { ResultObject } from '../../types';

class PrepareFingerprint3DS2 extends Component<PrepareFingerprint3DS2Props, PrepareFingerprint3DS2State> {
    public static type = 'scheme';

    constructor(props) {
        super(props);

        const { token, notificationURL } = this.props;

        if (token) {
            const fingerPrintData = prepareFingerPrintData({ token, notificationURL });

            this.state = {
                status: 'init',
                fingerPrintData
            };
        } else {
            this.state = { status: 'error' };
            this.props.onError('Missing fingerprintToken parameter');
        }
    }

    public static defaultProps = {
        onComplete: () => {},
        onError: () => {},
        paymentData: '',
        showSpinner: true
    };

    componentDidMount() {
        // If no fingerPrintData or no threeDSMethodURL - don't render component. Instead exit with threeDSCompInd: 'U'
        if (!this.state.fingerPrintData || !this.state.fingerPrintData.threeDSMethodURL || !this.state.fingerPrintData.threeDSMethodURL.length) {
            this.setStatusComplete({ threeDSCompInd: 'U' });
            return;
        }

        // Render
        this.setState({ status: 'retrievingFingerPrint' });
    }

    setStatusComplete(resultObj: ResultObject) {
        this.setState({ status: 'complete' }, () => {
            const data = createFingerprintResolveData(this.props.dataKey, resultObj, this.props.paymentData);
            console.log('### PrepareFingerprint3DS2::resolveObj:: ', data);
            this.props.onComplete(data);
        });
    }

    render(props, { fingerPrintData }) {
        if (this.state.status === 'retrievingFingerPrint') {
            return (
                <DoFingerprint3DS2
                    onCompleteFingerprint={fingerprint => {
                        this.setStatusComplete(fingerprint.result);
                    }}
                    onErrorFingerprint={fingerprint => {
                        const errorObject = handleErrorCode(fingerprint.errorCode);
                        this.props.onError(errorObject);
                        this.setStatusComplete(fingerprint.result);
                    }}
                    showSpinner={this.props.showSpinner}
                    {...fingerPrintData}
                />
            );
        }

        return null;
    }
}

export default PrepareFingerprint3DS2;
