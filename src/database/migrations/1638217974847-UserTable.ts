import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserTable1638217974847 implements MigrationInterface {
  private table = 'users';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'name',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'suspended',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'suspended_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'suspension_reason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_verified',
            type: 'boolean',
            default: false,
          },
        ],
      }),
      false,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // FIX: dropTable doesn't work
    await queryRunner.query(`DROP TABLE "${this.table}" CASCADE`);
  }
}
