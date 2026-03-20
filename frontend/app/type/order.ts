// 개별 주문 상품 DTO
export interface OrderItemDto {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

// 전체 주문 DTO
export interface OrderDto {
    id: number;
    address: string;
    postcode: string;
    status: boolean;
    totalPrice: number;
    createdDate: string;
    modifiedDate: string;
    orderItems: OrderItemDto[];
}