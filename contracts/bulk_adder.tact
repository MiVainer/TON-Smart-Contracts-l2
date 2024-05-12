import "@stdlib/deploy";

message Reach {
    counter: Address;
    target: Int as uint32;
}

message CounterValue {
    amount: Int as uint32;
}


contract BulkAdder with Deployable {

    target: Int as uint32;

    init() {
        self.target = 0;
    }
    //step 1
    receive(msg: Reach) {
        //require(msg.target<=10, "target can`t be more than 10"); - так работать с ошибками в смарт-контрактах
        if(msg.target>10){
            throw(123); // 123- код ошибки, который мы задали, коды являются сообщениями и их тоже можно обрабатывать
        }
        self.target = msg.target; // для теста = 5
        send(SendParameters{
            to: msg.counter, //адрес получателя
            value: 0, //количество TON
            mode: SendRemainingValue + SendIgnoreErrors,
            body: "query".asComment()

        });

    }

    //Step 3
    // принимаем сообщение от контракта counter
    receive(msg: CounterValue){
        if(self.target>msg.amount){
            send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: "increment".asComment()

            });
        }

    }

}
