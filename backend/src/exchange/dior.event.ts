export enum DIOREVENTS {
    // Emitters

    ADD = 'add',
    CANCEL = 'cancel',
    UPDATE = 'update',
    GET = 'get',

    // Order in
    ADD_ORDER = 'add_order',

    // Order out
    UPDATE_ORDER = 'update_order',
    CANCEL_ORDER = 'cancel_order',
    COMPLETE_ORDER = 'complete_order',

    STQ_QUOTE = 'stq_quote',
    STQ_TRADE = 'stq_trade',
    STQ_ORDERS = 'stq_orders',
}