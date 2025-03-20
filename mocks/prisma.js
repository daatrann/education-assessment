import { jest } from "@jest/globals";
const prismaMock = {
    teacher: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    student: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    notification: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    },
};

export default prismaMock;
