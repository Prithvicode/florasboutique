import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchOrderById } from "../redux/slices/orderSlice";
import { useParams } from "react-router-dom";

const OrderDetailPage = () => {
  const { id: orderId } = useParams<{ id: string }>(); // Explicitly typing for clarity
  console.log(orderId);

  const dispatch = useDispatch<AppDispatch>();
  const [order, setOrder] = useState<any>(null);
  const { loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId)).then((response) => {
        setOrder(response.payload);
      });
    }
  }, [dispatch, orderId]);

  console.log("orders: ", order);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold">Order Details</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {order ? (
        <div>
          {/* Order ID */}
          <h2>Order ID: {orderId}</h2>
          <p>Status: {order.order.status}</p>
          <p>
            Order Date: {new Date(order.order.createdAt).toLocaleDateString()}
          </p>

          {/* User Details */}
          {order.order.userDetails && (
            <div>
              <h3>User Details</h3>
              <p>
                Name: {order.order.userDetails.firstName}{" "}
                {order.order.userDetails.lastName}
              </p>
            </div>
          )}

          {/* Delivery Details */}
          {order.order.deliveryDetail && (
            <div>
              <h3>Delivery Details</h3>
              <p>Contact: {order.order.deliveryDetail.contactNo}</p>
              <p>Address: {order.order.deliveryDetail.address}</p>
              <p>City: {order.order.deliveryDetail.city}</p>
            </div>
          )}

          {/* Order Items */}
          <h3>Order Items</h3>
          {order.order.orderItems && order.order.orderItems.length > 0 ? (
            <ul>
              {order.order.orderItems.map((item: any) => (
                <li key={item._id}>
                  <div>
                    <p>
                      Product:{" "}
                      {order.order.productDetails?.name || "Unknown Product"}
                    </p>
                    <p>Price: ${order.order.productDetails?.price || "N/A"}</p>
                    <p>Quantity: {item.quantity}</p>
                    {item.productDetails?.imageUrls && (
                      <div>
                        <h4>Images:</h4>
                        <div className="flex space-x-2">
                          {item.productDetails.imageUrls.map(
                            (url: string, index: number) => (
                              <img
                                key={index}
                                src={url}
                                alt={`Product Image ${index + 1}`}
                                className="w-24 h-24 object-cover"
                              />
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No items in this order.</p>
          )}
        </div>
      ) : (
        <p>No order details available.</p>
      )}
    </div>
  );
};

export default OrderDetailPage;
