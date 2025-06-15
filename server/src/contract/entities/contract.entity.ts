import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { ContractStatus } from "../enums/contract-status";

@Entity("contract")
export class Contract {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.contracts)
  @JoinColumn({ name: "clientId" })
  client: User;

  @Column({ nullable: false })
  clientId: string;

  @Column({
    type: "enum",
    enum: ContractStatus,
    default: ContractStatus.QUOTE_REQUESTED,
  })
  status: ContractStatus;

  @Column({
    type: "varchar",
    length: 100,
    comment: "Type of AC unit (e.g. Split, Window, Central)",
  })
  acType: string;

  @Column({
    type: "int",
    unsigned: true,
    comment: "Number of AC units to be serviced",
  })
  unitCount: number;

  @Column({
    type: "varchar",
    length: 255,
    comment: "Full address where the service will take place",
  })
  address: string;

  @Column({
    type: "timestamp",
    comment: "Preferred date for the service by the client",
  })
  preferredDate: Date;

  @Column({
    type: "timestamp",
    nullable: true,
    comment: "Actual service date assigned by technician",
  })
  serviceDate: Date;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    comment: "Quoted amount in INR",
  })
  quoteAmount: number;

  @Column({
    type: "text",
    array: true,
    default: [],
    comment: "Internal notes or updates from team",
  })
  notes: string[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
