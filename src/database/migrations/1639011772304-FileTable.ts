import {
  MigrationInterface, QueryRunner, Table, TableForeignKey,
} from 'typeorm';

export class Filetable1639011772304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'files',
        columns: [
          {
            name: 'id',
            type: 'bigint',
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
            type: 'bigint',
          },
          {
            name: 'last_download_at',
            isNullable: true,
            type: 'timestamp',
          },
          {
            name: 'download_count',
            type: 'bigint',
          },
          {
            name: 'user_id',
            type: 'bigint',
          },
          {
            name: 'chunk_size',
            type: 'bigint',
          },
          {
            name: 'chunk_count',
            type: 'bigint',
          },
          {
            name: 'filesize',
            type: 'bigint',
          },
          {
            name: 's3_status',
            type: 'text',
            default: "'in_progress'",
          },
          {
            name: 's3_path',
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

    await queryRunner.createForeignKey('files', new TableForeignKey({
      columnNames: ['user_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query('DROP TABLE files');
  }
}
