import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";

describe("List product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const product = new Product("12345", "TV 50 pol Samsung", 100.99);

    await productRepository.create(product);

    const input = {
      name: "TV 50 pol Samsung",
      price: 100.99
    };

    const output = {
      name: "TV 50 pol Samsung",
      price: 100.99
    };

    const result = await usecase.execute(input);
    expect(Array.isArray(result.products)).toBe(true);
    expect(typeof result.products[0].id).toBe("string");
    expect(result.products[0].name).toEqual(output.name);
    expect(result.products[0].price).toEqual(output.price);
  });
});
