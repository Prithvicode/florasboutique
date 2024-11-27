import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchOrderById } from "../redux/slices/orderSlice";
import { Link, useParams } from "react-router-dom";

const OrderDetailPage = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [order, setOrder] = useState<any>(null);
  const { loading, error } = useSelector((state: RootState) => state.orders);
  console.log(order);
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId)).then((response) => {
        setOrder(response.payload);
      });
    }
  }, [dispatch, orderId]);

  return (
    <div className="container mx-auto p-6 font-ovo">
      <Link to="/orders" className="font-semibold hover:text-black/50">
        Go Back
      </Link>
      <h1 className="text-3xl font-semibold mb-6 text-center">Order Details</h1>
      {loading && <p className="text-xl text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {order ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
            {/* Order Summary */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">
                Order ID: {orderId}
              </h2>
              <p className="text-lg mb-1">Status: {order.order.status}</p>
              <p className="text-lg mb-3">
                Order Date:{" "}
                {new Date(order.order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* User Details */}
            {order.order.userDetails && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">User Details</h3>
                <p className="text-lg">
                  Name: {order.order.userDetails.firstName}{" "}
                  {order.order.userDetails.lastName}
                </p>
              </div>
            )}

            {/* Delivery Details */}
            {order.order.deliveryDetail && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Delivery Details</h3>
                <p className="text-lg">
                  Contact: {order.order.deliveryDetail.contactNo}
                </p>
                <p className="text-lg">
                  Address: {order.order.deliveryDetail.address}
                </p>
                <p className="text-lg">
                  City: {order.order.deliveryDetail.city}
                </p>
              </div>
            )}
          </div>

          {/* Right Section: Order Items */}
          <div className="bg-white p-6  shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Order Items</h3>
            {order.order.orderItems && order.order.orderItems.length > 0 ? (
              <div className="grid gap-6">
                {order.order.orderItems.map((item: any) => (
                  <div key={item._id} className="bg-gray-100 p-4  shadow-md">
                    {/* Product Info */}
                    <div className="mb-4">
                      <p className="font-semibold text-lg">
                        Product:{" "}
                        {order.order.productDetails?.name || "Unknown Product"}
                      </p>
                      <p className="text-gray-500">
                        Price: ${order.order.productDetails?.price || "N/A"}
                      </p>
                      <p className="text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    {/* Product Images */}
                    {order.order.productDetails?.imageUrls && (
                      <div>
                        <h4 className="text-md font-semibold mb-2">Images:</h4>
                        <div className="flex space-x-2">
                          <img
                            src={`http://localhost:5001${order.order.productDetails.imageUrls[0]}`}
                            alt={`Product Image `}
                            className="w-16  object-cover "
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No items in this order.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No order details available.</p>
      )}
    </div>
  );
};

export default OrderDetailPage;
