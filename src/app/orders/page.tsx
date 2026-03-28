'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/ToastContainer';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Truck, CheckCircle, XCircle, ShoppingBag } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, orders } = useAuthStore();
  const [activeTab, setActiveTab] = useState('all');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please login to view orders</h2>
            <Link href="/auth">
              <Button className="mt-4">Login Now</Button>
            </Link>
          </div>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">My Orders</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-white border rounded-lg p-1">
              <TabsTrigger value="all" className="rounded-md">All Orders</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-md">Pending</TabsTrigger>
              <TabsTrigger value="shipped" className="rounded-md">Shipped</TabsTrigger>
              <TabsTrigger value="delivered" className="rounded-md">Delivered</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h2>
              <p className="text-gray-500 mb-6">
                {activeTab === 'all'
                  ? "You haven't placed any orders yet"
                  : `No ${activeTab} orders`}
              </p>
              <Link href="/products">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                
                return (
                  <div key={order.id} className="bg-white rounded-xl border overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-semibold text-gray-900">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order Date</p>
                          <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-semibold text-gray-900">₹{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <Badge className={statusConfig[order.status].color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>

                    {/* Order Items */}
                    <div className="p-4">
                      <div className="flex flex-wrap gap-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-900 text-sm line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.size} | {item.color} | Qty: {item.quantity}
                              </p>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                ₹{item.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address */}
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                        <p className="text-sm text-gray-900">
                          {order.address.name}, {order.address.addressLine1}
                          {order.address.addressLine2 && `, ${order.address.addressLine2}`},{' '}
                          {order.address.city}, {order.address.state} - {order.address.pincode}
                        </p>
                      </div>

                      {/* Payment Info */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">
                            Payment: <span className="uppercase font-medium text-gray-900">{order.paymentMethod}</span>
                          </span>
                          <span className="text-gray-500">
                            Delivery: <span className="capitalize font-medium text-gray-900">{order.deliveryOption}</span>
                          </span>
                        </div>
                        <Link href={`/product/${order.items[0].productId}`}>
                          <Button variant="outline" size="sm">
                            View Product
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
