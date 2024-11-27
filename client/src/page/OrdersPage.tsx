import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchOrders, updateOrder } from "../redux/slices/orderSlice";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId: string, status: string) => {
    dispatch(updateOrder({ orderId, updatedData: { status } }));
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="container mx-auto p-4 font-ovo">
      <h1 className="text-3xl font-semibold">Orders</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="table-auto w-full mt-4 border-collapse text-center">
        <thead>
          <tr>
            <th className="border p-2">Order #</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="border p-2 text-center">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className={`border ${
                    order.status === "Pending"
                      ? "border-blue-500"
                      : order.status === "Delivered"
                      ? "border-green-500"
                      : order.status === "Cancelled"
                      ? "border-red-500"
                      : "border-gray-500"
                  } hover:bg-gray-100`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td className="border p-2 text-center">
                <Link
                  to={`/orders/${order._id}`}
                  className="bg-black text-white px-4 py-2 hover:bg-black/50"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
