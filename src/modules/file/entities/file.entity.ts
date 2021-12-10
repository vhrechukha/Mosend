import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from '../../user/entities/user.entity';

export enum ScanResult {
  MALICIOUS = 'MALICIOUS',
  PASSED = 'PASSED',
  NOSCAN = 'NOSCAN',
}

export type S3Status = 'in_progress' | 'finished';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    filename: string;

  @Column()
    extension: string;

  @Column()
    content_type: string;

  @Column()
  @Exclude({ toPlainOnly: true })
    s3_path: string;

  @Column({ default: 'in_progress' })
    s3_status: S3Status;

  @Column()
    filesize: string;

  @Column()
    chunk_count: number;

  @Column()
    chunk_size: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
    user: User;

  @Column()
    user_id: number;

  @Column({ nullable: true })
    download_count: number;

  @Column({ type: 'timestamp', nullable: true })
    last_download_at: Date;

  @Column({ nullable: true })
    max_download_count: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
    created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
    updated_at: Date;

  @Column({
    type: 'enum',
    enum: ScanResult,
    default: ScanResult.NOSCAN,
  })
    scan_result: ScanResult;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
    last_scan_date: Date;

  @Column({
    nullable: true,
  })
    scan_detection_info: string;
}
