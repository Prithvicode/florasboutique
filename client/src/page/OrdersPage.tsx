import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchOrders, updateOrder } from "../redux/slices/orderSlice";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

const OrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.orders
  );

  const token = localStorage.getItem("jwt");

  let decoded: DecodedToken | null = null;

  if (token) {
    try {
      decoded = jwtDecode<DecodedToken>(token);
    } catch (e) {
      console.error("Invalid token", e);
    }
  }

  // Filter orders based on user ID
  const filteredOrders = useMemo(() => {
    if (!decoded || !orders) return [];
    if (decoded.role === "user") {
      return orders.filter((order) => order.userDetails._id === decoded.id);
    }
    return orders;
  }, [decoded, orders]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId: string, status: string) => {
    await dispatch(updateOrder({ orderId, updatedData: { status } }));
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="container mx-auto p-4 font-ovo">
      <h1 className="text-3xl font-semibold">Orders</h1>
      {error && <p className="text-red-500">{error}</p>}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
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
            {filteredOrders.map((order, index) => (
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
                    disabled={decoded?.role === "user"} // Disable if user role is "user"
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
      )}
    </div>
  );
};

export default OrdersPage;
