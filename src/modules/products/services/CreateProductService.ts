import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    let product = await this.productsRepository.findByName(name);

    if (!product) {
      product = await this.productsRepository.create({
        name,
        price,
        quantity,
      });

      return product;
    }

    throw new AppError(
      'Não é possível o cadastro de produtos com nomes iguais',
    );
  }
}

export default CreateProductService;
