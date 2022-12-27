import { Dispatch, SetStateAction } from "react";
import clone from "clone";
import { useForm } from "react-hook-form";

interface CafeStatus {
  tables: Table[];
  reserved: Reserved;
}

interface Table {
  tableName: string;
  empty: boolean | string;
  startTime?: Date;
}

interface Reserved {
  reservedPersons: ReservedPerson;
  waitingMinutes?: number;
}

interface ReservedPerson {
  [name: string]: ReservedPersonStatus;
}

interface ReservedPersonStatus {
  reservedTime?: Date;
  enter: boolean;
}

interface InputReservedPerson {
  name: string;
  enter: boolean | string;
}

interface UpdateCafeStatusProps {
  cafeStatus: CafeStatus;
  setCafeStatus: Dispatch<SetStateAction<CafeStatus>>;
}

interface UpdateReservedProps {
  cafeStatus: CafeStatus;
  setCafeStatus: Dispatch<SetStateAction<CafeStatus>>;
}

const UpdateCafeStatus: React.FC<UpdateCafeStatusProps> = ({
  cafeStatus,
  setCafeStatus,
}: UpdateCafeStatusProps) => {
  return (
    <div>
      <span>
        <li>ステータスの更新</li>
      </span>
      <ul>
        <li>
          <UpdateTables cafeStatus={cafeStatus} setCafeStatus={setCafeStatus} />
        </li>

        <li>
          <UpdateReserved
            cafeStatus={cafeStatus}
            setCafeStatus={setCafeStatus}
          />
        </li>
      </ul>
    </div>
  );
};

const UpdateTables: React.FC<UpdateCafeStatusProps> = ({
  cafeStatus,
  setCafeStatus,
}: UpdateCafeStatusProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Table>();

  const onSubmit = (table: Table) => {
    const index = Number(table.tableName.substring(3)) - 1;
    let newCafeStatus = clone(cafeStatus);
    if (table.empty == "empty") {
      newCafeStatus.tables[index].empty = true;
    } else {
      newCafeStatus.tables[index].empty = false;
    }
    newCafeStatus.tables[index].startTime = new Date();
    setCafeStatus(newCafeStatus);
  };

  return (
    <div>
      <div>テーブル</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>座席番号</label>
          <select {...register("tableName")}>
            <option value={""}>{""}</option>
            {cafeStatus.tables.map((table) => (
              <option value={table.tableName} key={table.tableName}>
                {table.tableName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="radio"
            value="empty"
            {...register("empty")}
            defaultChecked
          />
          <label htmlFor="empty">空席</label>
          <input type="radio" value="use" {...register("empty")} />
          <label htmlFor="use">着席</label>
        </div>

        <div>
          <button type="submit">更新</button>
        </div>
      </form>
    </div>
  );
};

const UpdateReserved: React.FC<UpdateReservedProps> = ({
  cafeStatus,
  setCafeStatus,
}: UpdateReservedProps) => {
  return (
    <div>
      <div>ご予約</div>
      <CreateReservedPerson
        cafeStatus={cafeStatus}
        setCafeStatus={setCafeStatus}
      />

      <UpdateReservedPerson
        cafeStatus={cafeStatus}
        setCafeStatus={setCafeStatus}
      />

      <UpdateReservedWaitingMinutes
        cafeStatus={cafeStatus}
        setCafeStatus={setCafeStatus}
      />
    </div>
  );
};

const CreateReservedPerson: React.FC<UpdateReservedProps> = ({
  cafeStatus,
  setCafeStatus,
}: UpdateReservedProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputReservedPerson>();

  const onSubmit = (input: InputReservedPerson) => {
    if (input.name !== "") {
      let cloned = clone(cafeStatus);
      cloned.reserved.reservedPersons[input.name] = {
        reservedTime: new Date(),
        enter: false,
      };
      setCafeStatus(cloned);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>お名前</label>
          <input
            type="text"
            maxLength={20}
            size={20}
            {...register("name")}
          ></input>
          <button type="submit">予約</button>
        </div>
      </form>
    </div>
  );
};

const UpdateReservedPerson: React.FC<UpdateReservedProps> = ({
  cafeStatus,
  setCafeStatus,
}: UpdateReservedProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputReservedPerson>();

  const onSubmit = (input: InputReservedPerson) => {
    if (input.name !== "") {
      let cloned = clone(cafeStatus);
      if (input.enter == "enter") {
        cloned.reserved.reservedPersons[input.name].enter = true; // ToDo:
      } else {
        delete cloned.reserved.reservedPersons[input.name];
      }
      setCafeStatus(cloned);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">お名前</label>
        <select {...register("name")}>
          <option value={""}>{""}</option>
          {Object.keys(cafeStatus.reserved.reservedPersons).map((name) => (
            <option value={name} key={name}>
              {name}
            </option>
          ))}
        </select>
        <input
          type="radio"
          {...register("enter")}
          value="delete"
          defaultChecked
        />
        <label htmlFor="delete">削除</label>
        <input type="radio" {...register("enter")} value="enter" />
        <label htmlFor="enter">ご帰宅</label>

        <button type="submit">更新</button>
      </form>
    </div>
  );
};

const UpdateReservedWaitingMinutes: React.FC<UpdateReservedProps> = ({
  cafeStatus,
  setCafeStatus,
}: UpdateReservedProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Reserved>();

  const onSubmit = (reserved: Reserved) => {
    let cloned = clone(cafeStatus);
    cloned.reserved.waitingMinutes = reserved.waitingMinutes;
    setCafeStatus(cloned);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        お待ち時間
        <input
          type="text"
          maxLength={3}
          size={3}
          {...register("waitingMinutes")}
        />
        <button type="submit">送信</button>
      </form>
    </div>
  );
};

export { UpdateCafeStatus };
export type { CafeStatus };
