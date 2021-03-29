import { makeCallbackObjectsValidation } from './utils/callbackUtils';
import { removeEncryptedElement } from '../ui/encryptedElements';
import { processErrors } from './utils/processErrors';
import { existy } from '../utilities/commonUtils';
import { ENCRYPTED_SECURITY_CODE, ENCRYPTED_CARD_NUMBER } from '../configuration/constants';
import { SFFeedbackObj, CbObjOnFieldValid } from '../types';

export function handleValidation(pFeedbackObj: SFFeedbackObj): void {
    // --
    let callbackObjectsArr: CbObjOnFieldValid[];
    const fieldType: string = pFeedbackObj.fieldType;
    const isGenericCard: boolean = this.state.type === 'card';

    /**
     * CHECK IF CVC IS OPTIONAL
     */
    // Brand information (from setting the CC number) now contains information about
    // whether cvc is optional for that brand e.g. maestro
    // If it is optional, and we're dealing with the generic card type,
    // (re)set the property that indicates this (in the CVC SecuredField instance)
    if (
        isGenericCard &&
        Object.prototype.hasOwnProperty.call(pFeedbackObj, 'cvcPolicy') &&
        existy(pFeedbackObj.cvcPolicy) &&
        Object.prototype.hasOwnProperty.call(this.state.securedFields, ENCRYPTED_SECURITY_CODE)
    ) {
        this.state.securedFields[ENCRYPTED_SECURITY_CODE].cvcPolicy = pFeedbackObj.cvcPolicy;
    }

    /**
     * PROCESS & BROADCAST ERRORS (OR LACK OF)
     */
    processErrors(pFeedbackObj, this.state.securedFields[fieldType], this.state.type, this.props.rootNode, this.callbacks.onError);

    /**
     * REMOVE ANY EXISTING ENCRYPTED ELEMENT & CHECK VALIDITY OF THE FORM AS A WHOLE
     */
    // If the field was previously encrypted...
    if (this.state.securedFields[fieldType].isEncrypted) {
        // callbackObjectsArr will be an array containing 1 or 2 objects that need to be broadcast
        callbackObjectsArr = makeCallbackObjectsValidation(fieldType, this.state.type, this.props.rootNode);

        // Add the endDigits to the object we send to the onFieldValid callback
        // NOTE: in this case (validation) this will be an empty string
        if (fieldType === ENCRYPTED_CARD_NUMBER) {
            callbackObjectsArr[0].endDigits = '';
        }

        for (let i = 0, len = callbackObjectsArr.length; i < len; i += 1) {
            // Remove DOM elements
            if (this.config.allowedDOMAccess) {
                removeEncryptedElement(this.props.rootNode, callbackObjectsArr[i].uid);
            }

            // ...BROADCAST VALID STATE OF INDIVIDUAL INPUTS
            this.callbacks.onFieldValid(callbackObjectsArr[i]);
        }

        // Remove the field's encrypted state
        this.state.securedFields[fieldType].isEncrypted = false;
    }

    /**
     * STORE & BROADCAST VALID STATE OF THE FORM AS A WHOLE
     */
    this.assessFormValidity();

    /**
     * PROCESS & BROADCAST CARD BRANDS
     */
    if (Object.prototype.hasOwnProperty.call(pFeedbackObj, 'brand')) {
        this.processBrand(pFeedbackObj);
    }
}
