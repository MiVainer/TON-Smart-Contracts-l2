import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { BulkAdder } from '../wrappers/BulkAdder';
import '@ton/test-utils';
import { Counter } from '../build/Counter/tact_Counter';

describe('BulkAdder and Counter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let bulkAdder: SandboxContract<BulkAdder>;
    let counter: SandboxContract<Counter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        bulkAdder = blockchain.openContract(await BulkAdder.fromInit());
        counter = blockchain.openContract(await Counter.fromInit(1n));

        deployer = await blockchain.treasury('deployer');

        const deployResultBulkAdder = await bulkAdder.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        const deployResultCounter= await counter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );


        expect(deployResultBulkAdder.transactions).toHaveTransaction({
            from: deployer.address,
            to: bulkAdder.address,
            deploy: true,
            success: true,
        });

        expect(deployResultCounter.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and bulkAdder are ready to use
    });
    it('should increase to target ', async () => {
        const target = 5n
        const res = await bulkAdder.send(deployer.getSender(), {
            value: toNano('0.5') // Количество имеющихся TON
        }, {
            $$type: 'Reach',
            counter: counter.address,
            target
        })

        const count = await counter.getCounter()
        expect(count).toEqual(target);

    })

});
