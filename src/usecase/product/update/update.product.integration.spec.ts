import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";

describe("Test update product use case", () => {
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

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);
    
    const product = new Product("123", "Video K7 Panasonic", 25.99);
    

    await productRepository.create(product);

    const input = {
        id:"123",
        name: "Video K7 Samsung",
        price: 30.99
    };

    const output = {
      name: "Video K7 Samsung",
      price: 30.99
    };

    const result = await usecase.execute(input);
    expect(typeof result.id).toBe("string");
    expect(result.name).toEqual(output.name);
    expect(result.price).toEqual(output.price);
  });
});
