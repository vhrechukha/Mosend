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
            type: 'int4',
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
            name: 'max_download_count',
            type: 'int4',
          },
          {
            name: 'last_download_at',
            type: 'timestamp',
          },
          {
            name: 'download_count',
            type: 'int4',
          },
          {
            name: 'user_id',
            type: 'int4',
          },
          {
            name: 'chunk_size',
            type: 'int4',
          },
          {
            name: 'chunk_count',
            type: 'int4',
          },
          {
            name: 'filesize',
            type: 'int4',
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
