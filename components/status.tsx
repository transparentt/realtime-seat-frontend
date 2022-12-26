import { Dispatch, SetStateAction } from "react";
import clone from "clone";
import { useForm } from "react-hook-form";
import { Cafe } from "../components/cafe";

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
  reservedPersons: ReservedPerson[];
  waitingMinutes?: number;
}

interface ReservedPerson {
  name: string;
  reservedTime: Date;
}

interface UpdateCafeStatusProps {
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
        <li>ステータス更新</li>
      </span>
      <ul>
        <li>
          <UpdateTables cafeStatus={cafeStatus} setCafeStatus={setCafeStatus} />
        </li>

        <li>
          予約名
          <select name="予約名">
            {cafeStatus.reserved.reservedPersons.map((person) => (
              <option value={person.name}>{person.name}</option>
            ))}
          </select>
          <input type="radio" name="reserved" id="delete" defaultChecked />
          <label htmlFor="delete">削除</label>
          <input type="radio" name="reserved" id="enter" />
          <label htmlFor="enter">ご帰宅 </label>
          <button type="submit">送信</button>
        </li>

        <li>
          <label>予約名</label>
          <input type="text" maxLength={20} size={20} id="reservedName"></input>
          <button type="submit">予約</button>
        </li>

        <li>
          待ち時間(分)<input type="text" maxLength={3} size={3}></input>
          <button type="submit">送信</button>
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

export { UpdateCafeStatus };
export type { CafeStatus, Table, Reserved, ReservedPerson };
