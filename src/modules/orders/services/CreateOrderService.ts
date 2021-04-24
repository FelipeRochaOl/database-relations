import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Este cliente não existe');
    }

    try {
      const findProducts = await this.productsRepository.findAllById(products);

      const productsOrder = products.map(product => {
        const productDB = findProducts.filter(
          findProduct => findProduct.id === product.id,
        );

        if (!productDB) {
          throw new AppError('Não encontrado este produto', 400);
        }

        if (productDB[0].quantity < product.quantity) {
          throw new AppError(
            'Esta quantidade é superior ao estoque disponível',
            400,
          );
        }

        if (product.quantity <= 0) {
          throw new AppError('Esta quantidade é inválida', 400);
        }

        return {
          product_id: product.id,
          price: productDB[0].price,
          quantity: product.quantity,
        };
      });

      const orders = await this.ordersRepository.create({
        customer,
        products: productsOrder,
      });

      await this.productsRepository.updateQuantity(products);

      return orders;
    } catch (err) {
      throw new AppError('Parametros inválidos', 400);
    }
  }
}

export default CreateOrderService;
