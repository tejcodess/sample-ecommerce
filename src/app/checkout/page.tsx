'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/ToastContainer';
import { useCartStore, useAuthStore, useToastStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CreditCard,
  Smartphone,
  Wallet,
  Truck,
  Package,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import type { Address, Order } from '@/store/authStore';

const steps = [
  { id: 1, name: 'Address', icon: MapPin },
  { id: 2, name: 'Delivery', icon: Truck },
  { id: 3, name: 'Payment', icon: CreditCard },
  { id: 4, name: 'Confirm', icon: CheckCircle },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, getSubtotal, getDiscount, clearCart } = useCartStore();
  const { user, isAuthenticated, addAddress, updateAddress, removeAddress, addOrder } = useAuthStore();
  const { addToast } = useToastStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Guest address storage (for non-authenticated users)
  const [guestAddresses, setGuestAddresses] = useState<Address[]>([]);
  
  // Address form state
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Andhra Pradesh',
    pincode: '',
    isDefault: false,
  });

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCharge = deliveryOption === 'express' ? 199 : (getTotal() >= 999 ? 0 : 99);
  const total = getTotal() + deliveryCharge;

  // Get addresses based on auth status
  const addresses = isAuthenticated ? (user?.addresses || []) : guestAddresses;

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/cart');
    }
  }, [items.length, router, orderComplete]);

  // Auto-select first address if available
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find(a => a.isDefault);
      setSelectedAddress(defaultAddr?.id || addresses[0].id);
    }
  }, [addresses, selectedAddress]);

  const handleAddressSubmit = () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.addressLine1 || !addressForm.city || !addressForm.pincode) {
      addToast('Please fill all required fields', 'warning');
      return;
    }

    const newAddress: Address = {
      ...addressForm,
      id: Date.now().toString(),
    };

    if (editingAddress) {
      // Update existing address
      if (isAuthenticated) {
        updateAddress(editingAddress.id, addressForm);
      } else {
        setGuestAddresses(prev => prev.map(a => 
          a.id === editingAddress.id ? { ...addressForm, id: editingAddress.id } : a
        ));
      }
      addToast('Address updated', 'success');
    } else {
      // Add new address
      if (isAuthenticated) {
        addAddress(addressForm);
      } else {
        setGuestAddresses(prev => [...prev, newAddress]);
      }
      addToast('Address added', 'success');
    }

    // Auto-select the new/updated address
    setSelectedAddress(editingAddress?.id || newAddress.id);
    
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressForm({
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: 'Andhra Pradesh',
      pincode: '',
      isDefault: false,
    });
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (isAuthenticated) {
      removeAddress(addressId);
    } else {
      setGuestAddresses(prev => prev.filter(a => a.id !== addressId));
    }
    
    if (selectedAddress === addressId) {
      const remainingAddresses = addresses.filter(a => a.id !== addressId);
      setSelectedAddress(remainingAddresses.length > 0 ? remainingAddresses[0].id : '');
    }
    
    addToast('Address removed', 'info');
  };

  const handlePlaceOrder = () => {
    const selectedAddressObj = addresses.find((a) => a.id === selectedAddress);
    
    if (!selectedAddressObj) {
      addToast('Please select a delivery address', 'warning');
      return;
    }

    const newOrderId = `F6${Date.now().toString().slice(-8)}`;
    
    const order: Order = {
      id: newOrderId,
      userId: user?.id || 'guest',
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })),
      address: selectedAddressObj,
      paymentMethod,
      deliveryOption,
      subtotal,
      discount,
      deliveryCharge,
      total,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    clearCart();
    setOrderId(newOrderId);
    setOrderComplete(true);
    setCurrentStep(4);
    addToast('Order placed successfully!', 'success');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedAddress !== '';
      case 2:
        return deliveryOption !== '';
      case 3:
        return paymentMethod !== '';
      default:
        return true;
    }
  };

  const renderAddressForm = () => (
    <div className="border rounded-lg p-4 space-y-4 bg-gray-50 mt-4">
      <h3 className="font-medium text-gray-900">
        {editingAddress ? 'Edit Address' : 'Add New Address'}
      </h3>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={addressForm.name}
            onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
            placeholder="Enter full name"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={addressForm.phone}
            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
            placeholder="Enter phone number"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="addressLine1">Address Line 1 *</Label>
        <Input
          id="addressLine1"
          value={addressForm.addressLine1}
          onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
          placeholder="House/Flat No., Building Name"
        />
      </div>
      
      <div>
        <Label htmlFor="addressLine2">Address Line 2</Label>
        <Input
          id="addressLine2"
          value={addressForm.addressLine2}
          onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
          placeholder="Street, Area, Landmark"
        />
      </div>
      
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={addressForm.city}
            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
            placeholder="City"
          />
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={addressForm.state}
            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="pincode">Pincode *</Label>
          <Input
            id="pincode"
            value={addressForm.pincode}
            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
            placeholder="533103"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleAddressSubmit}>
          {editingAddress ? 'Update Address' : 'Save Address'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShowAddressForm(false);
            setEditingAddress(null);
            setAddressForm({
              name: '',
              phone: '',
              addressLine1: '',
              addressLine2: '',
              city: '',
              state: 'Andhra Pradesh',
              pincode: '',
              isDefault: false,
            });
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Select Delivery Address</h2>
            
            {!isAuthenticated && (
              <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">
                You&apos;re checking out as a guest. Your address will be used for this order only.
                <Link href="/auth" className="text-blue-600 hover:underline ml-1">
                  Login to save addresses
                </Link>
              </p>
            )}
            
            {/* Show existing addresses */}
            {addresses.length > 0 && (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedAddress === address.id
                        ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="mt-1">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedAddress === address.id
                              ? 'border-gray-900 bg-gray-900'
                              : 'border-gray-300'
                          }`}>
                            {selectedAddress === address.id && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{address.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                          {address.isDefault && (
                            <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add new address button/form */}
            {!showAddressForm ? (
              <Button variant="outline" onClick={() => setShowAddressForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {addresses.length > 0 ? 'Add New Address' : 'Add Delivery Address'}
              </Button>
            ) : (
              renderAddressForm()
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Choose Delivery Option</h2>
            
            <div className="space-y-3">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  deliveryOption === 'standard'
                    ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                onClick={() => setDeliveryOption('standard')}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      deliveryOption === 'standard'
                        ? 'border-gray-900 bg-gray-900'
                        : 'border-gray-300'
                    }`}>
                      {deliveryOption === 'standard' && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Standard Delivery</p>
                      <p className="text-sm text-gray-600">5-7 Business Days</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">
                    {getTotal() >= 999 ? 'FREE' : '₹99'}
                  </p>
                </div>
              </div>
              
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  deliveryOption === 'express'
                    ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                onClick={() => setDeliveryOption('express')}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      deliveryOption === 'express'
                        ? 'border-gray-900 bg-gray-900'
                        : 'border-gray-300'
                    }`}>
                      {deliveryOption === 'express' && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Express Delivery</p>
                      <p className="text-sm text-gray-600">2-3 Business Days</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">₹199</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Select Payment Method</h2>
            
            <div className="space-y-3">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                onClick={() => setPaymentMethod('upi')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'upi'
                      ? 'border-gray-900 bg-gray-900'
                      : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'upi' && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">UPI Payment</p>
                    <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</p>
                  </div>
                </div>
              </div>
              
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card'
                      ? 'border-gray-900 bg-gray-900'
                      : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'card' && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Credit / Debit Card</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
                  </div>
                </div>
              </div>
              
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'cod'
                      ? 'border-gray-900 bg-gray-900'
                      : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'cod' && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <Wallet className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when you receive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        if (orderComplete) {
          return (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-4">Thank you for shopping with F6 The Fashion Store</p>
              
              <div className="bg-gray-50 rounded-lg p-4 max-w-sm mx-auto mb-6">
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="text-xl font-bold text-gray-900">{orderId}</p>
              </div>

              <div className="bg-white border rounded-lg p-4 max-w-md mx-auto text-left mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="uppercase">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-semibold">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/orders">
                  <Button variant="outline">View Orders</Button>
                </Link>
                <Link href="/products">
                  <Button>Continue Shopping</Button>
                </Link>
              </div>
            </div>
          );
        }
        
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-gray-900">Cart</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

          {/* Progress Steps */}
          {!orderComplete && (
            <div className="flex items-center justify-between mb-8 overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep > step.id
                          ? 'bg-green-500 text-white'
                          : currentStep === step.id
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="font-medium hidden sm:inline">{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 sm:w-24 h-0.5 mx-2 ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Step Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border p-6">
                {renderStepContent()}
              </div>
            </div>

            {/* Order Summary */}
            {!orderComplete && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  {/* Items Preview */}
                  <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.size} | {item.color} | Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Price Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-2 mt-6">
                    {currentStep > 1 && !orderComplete && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back
                      </Button>
                    )}
                    {currentStep < 3 && (
                      <Button
                        className="flex-1 bg-gray-900 hover:bg-gray-800"
                        disabled={!canProceed()}
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        Continue
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                    {currentStep === 3 && (
                      <Button
                        className="flex-1 bg-gray-900 hover:bg-gray-800"
                        disabled={!canProceed()}
                        onClick={handlePlaceOrder}
                      >
                        Place Order
                      </Button>
                    )}
                  </div>
                  
                  {/* Helper text for Continue button */}
                  {currentStep === 1 && !canProceed() && (
                    <p className="text-xs text-amber-600 mt-2 text-center">
                      Please add and select a delivery address to continue
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
