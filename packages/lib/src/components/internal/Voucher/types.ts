export interface VoucherDetail {
    label: string;
    value: string;
}

export interface VoucherProps {
    /** Payment method used to generate the voucher. */
    paymentMethodType: string;

    /** Payment method image to be displayed on the voucher. */
    imageUrl?: string;

    /** If applicable, it will render an issuer image next to the payment method image. */
    issuerImageUrl?: string;

    /** Voucher instructions URL. */
    instructionsUrl?: string;

    /** Download URL for the voucher. It will display a button allowing the shopper to download it. */
    downloadUrl?: string;

    /** Introduction text on the voucher. */
    introduction?: string;

    /** Payment reference. */
    reference?: string;

    /** URL to a barcode image representing the payment reference. */
    barcode?: string;

    /** Total amount displayed on the voucher. */
    amount?: string;

    /** Any additional surcharge to the amount. */
    surcharge?: any;

    /** List of details that will be rendered on the voucher. */
    voucherDetails?: VoucherDetail[];

    /** Additional CSS classes. */
    className?: string;

    /** Show/Hide a button to copy the payment reference. It will only show if a reference is available. */
    copyBtn?: boolean;
}
