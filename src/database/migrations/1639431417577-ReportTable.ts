import {
  MigrationInterface, QueryRunner, Table, TableForeignKey,
} from 'typeorm';
import { ReportStatus } from '../../modules/report/entitites/Report.entity';

export class ReportTable1639431417577 implements MigrationInterface {
  private table = 'reports';

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
            name: 'file_id',
            type: 'int',
          },
          {
            name: 'message',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'ip',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'text',
            default: `'${ReportStatus.NOT_REVIEWED}'`,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      false,
    );

    await queryRunner.createForeignKey(this.table, new TableForeignKey({
      columnNames: ['file_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'files',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
