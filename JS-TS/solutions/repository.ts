export class InMemoryRepository<T extends { id: number }> {
  // private storage
  private items: T[] = [];

  add(entity: T): T {
    this.items.push(entity);

    return entity;
  }

  update(id: number, patch: Partial<T>): T {
    const entity = this.findById(id);

    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }

    this.items = this.items.map((entity) => {
      if (entity.id === id) {
        entity = {
          ...entity,
          ...patch
        }
      }

      return entity
    })

    return {...entity, ...patch}

  }

  remove(id: number): void {
    const entity = this.findById(id);

    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }

    this.items = this.items.filter((entity) => entity.id !== id)
  }

  findById(id: number): T | undefined {
    return this.items.find((entity) => entity.id === id)
  }

  findAll(): T[] {
    return this.items
  }
}
