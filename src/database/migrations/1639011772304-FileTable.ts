import {MigrationInterface, QueryRunner, Table} from "typeorm";

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
                        name: 'maxDownloadCount',
                        type: 'int4',
                        isNullable: false,
                    },
                    {
                        name: 'lastDownloadAt',
                        type: 'timestamp',
                    },
                    {
                        name: 'downloadCount',
                        type: 'int4',
                    },
                    {
                        name: 'user_id',
                        type: 'int4',
                    },
                    {
                        name: 'chunkSize',
                        type: 'int4',
                    },
                    {
                        name: 'chunkCount',
                        type: 'int4',
                    },
                    {
                        name: 'filesize',
                        type: 'text',
                    },
                    {
                        name: 's3_status',
                        type: 'text',
                        default: "'inProgress'"
                    },
                    {
                        name: 's3_path',
                        type: 'text',
                    },
                    {
                        name: 'contentType',
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
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        queryRunner.query(`DROP TABLE files`);
    }
}
