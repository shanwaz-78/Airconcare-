import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Contract } from '../../contract/entities/contract.entity';
import { UserRole } from '../enums/user-role';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @OneToMany(() => Contract, (contract) => contract.client)
  contracts: Contract[];
}
