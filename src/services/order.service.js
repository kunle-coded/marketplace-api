// src/services/order.service.js

const Order = require("../repositories/order.repository");
const Product = require("../repositories/product.repository");
const { ForbiddenError, BadRequestError, NotFoundError } = require("../errors");
const {
  STANDARD_TAX_RATE,
  FLAT_SHIPPING_RATE,
} = require("../constants/orderRules");

const create = async (user, cartPayload) => {
  if (user.role !== "buyer") {
    throw new ForbiddenError(
      "Access denied. Only registered buyer accounts have permission to order products.",
    );
  }

  if (!cartPayload) {
    throw new BadRequestError("Order data cannot be empty.");
  }

  const { items, shippingAddress } = cartPayload;

  const productIds = items.map((item) => item.productId);
  const databaseProducts = await Product.findAny(productIds);

  const priceMap = new Map(
    databaseProducts.map((p) => [
      p.id,
      {
        price: Number(p.price),
        name: p.name,
        quantity_available: p.quantity_available,
      },
    ]),
  );

  let subtotal = 0;
  const orderItemsData = items.map((item) => {
    const secureProduct = priceMap.get(item.productId);

    if (!secureProduct) {
      throw new NotFoundError(
        `Product with ID ${item.productId} no longer exists.`,
      );
    }

    if (item.quantity > secureProduct.quantity_available) {
      throw new BadRequestError(
        `Quantity ordered for '${secureProduct.name}', exceeds available stock.`,
      );
    }

    const itemTotal = secureProduct.price * item.quantity;
    subtotal += itemTotal;

    return {
      productId: item.productId,
      historicalName: secureProduct.name,
      priceAtPurchase: secureProduct.price,
      quantity: item.quantity,
      warehouseLocation: item.warehouseLocation,
    };
  });

  const shippingFee = subtotal > 100 ? 0.0 : FLAT_SHIPPING_FEE;
  const tax = subtotal * STANDARD_TAX_RATE;
  const total = subtotal + tax + shippingFee;

  const databasePayload = {
    buyerId: user.id,
    subtotal,
    tax,
    shippingFee: FLAT_SHIPPING_RATE,
    total,
    shippingName: shippingAddress.name,
    shippingAddress1: shippingAddress.address1,
    shippingAddress2: shippingAddress.address2,
    shippingCity: shippingAddress.city,
    shippingState: shippingAddress.state,
    shippingPostalCode: shippingAddress.postalCode,
    shippingCountry: shippingAddress.country,
  };

  const order = await Order.save(databasePayload, orderItemsData);

  return order;
};

const list = async (user) => {
  if (user.role === "admin") {
    return await Order.findAll();
  }

  return await Order.findByBuyerId(user.id);
};

module.exports = { create, list };
