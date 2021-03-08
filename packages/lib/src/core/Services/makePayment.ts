import { httpPost } from './http';
import Session from '../CheckoutSession';

/**
 */
function makePayment(paymentRequest, session: Session): Promise<any> {
    const path = `v1/sessions/${session.id}/payments?clientKey=${session.clientKey}`;
    const data = {
        sessionData: session.data,
        ...paymentRequest
    };

    return httpPost({ loadingContext: session.loadingContext, path }, data).then(response => {
        if (response.sessionData) {
            session.updateSessionData(response.sessionData);
        }

        return response;
    });
}

export default makePayment;