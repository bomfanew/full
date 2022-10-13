import { Sequelize } from "sequelize-typescript";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import ListCustomerUseCase from "./list.customer.usecase";

describe("List customer use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list a customer", async () => {
    const customerRepository = new CustomerRepository();
    const usecase = new ListCustomerUseCase(customerRepository);

    const customer = new Customer("123", "John");
    const address = new Address("Street", 123, "Zip", "City");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const input = {
        name: "John",
        address: {
            street: "Street",
            city: "City",
            number: 123,
            zip: "Zip",
          },
    };

    const output = {
      name: "John",
      address: {
        street: "Street",
        city: "City",
        number: 123,
        zip: "Zip",
      },
    };

    const result = await usecase.execute(input);
    expect(Array.isArray(result.customers)).toBe(true);
    expect(typeof result.customers[0].id).toBe("string");
    expect(result.customers[0].name).toEqual(output.name);
    expect(result.customers[0].address).toEqual(output.address);
  });
});
