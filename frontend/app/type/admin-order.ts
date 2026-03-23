export type AdminOrderDto = {
    id: number,
    customerEmail: string,
    address: string,
    postcode: string,
    status: boolean,
    totalPrice: number,
    createdDate: string,
    modifiedDate: string
}