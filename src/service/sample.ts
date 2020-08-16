import { ObjectLiteral } from '../type';

export class SampleService {
    public async getById(id: string) {
        return {
            id,
            title: 'Some demo data',
        };
    }

    public async create(data: ObjectLiteral) {
        return {
            ...data,
            id: '6e086b10-b0ee-4d21-a1ed-66704219d54f',
        };
    }
}
