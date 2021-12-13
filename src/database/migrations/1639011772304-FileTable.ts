import {
  MigrationInterface, QueryRunner, Table, TableForeignKey,
} from 'typeorm';

export class Filetable1639011772304 implements MigrationInterface {
  private table = 'files';

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
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'max_download_count',
            isNullable: true,
            type: 'int',
          },
          {
            name: 'last_download_at',
            isNullable: true,
            type: 'timestamp',
          },
          {
            name: 'download_count',
            isNullable: true,
            type: 'int',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'chunk_size',
            type: 'int',
          },
          {
            name: 'chunk_count',
            type: 'int',
          },
          {
            name: 'scan_result',
            isNullable: true,
            type: 'text',
          },
          {
            name: 'last_scan_date',
            isNullable: true,
            type: 'timestamp',
          },
          {
            name: 'scan_detection_info',
            isNullable: true,
            type: 'text',
          },
          {
            name: 'filesize',
            type: 'int',
          },
          {
            name: 's3_status',
            type: 'text',
            default: "'in_progress'",
          },
          {
            name: 's3_path',
            isNullable: true,
            type: 'text',
          },
          {
            name: 'content_type',
            type: 'text',
          },
          {
            name: 'extension',
            type: 'text',
          },
          {
            name: 'filename',
            type: 'text',
          },
        ],
      }),
      false,
    );

    await queryRunner.createForeignKey(this.table, new TableForeignKey({
      columnNames: ['user_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
