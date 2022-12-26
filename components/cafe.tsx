import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { CafeStatus, Table } from "./status";

interface Cafe {
  name: string;
  address: string;
  access: string;
  tableNum: number;
  note?: string;
}

interface CafeInfoProps {
  cafe: Cafe;
}

interface UpdateCafeProps {
  cafe: Cafe;
  setCafe: Dispatch<SetStateAction<Cafe>>;
  cafeStatus: CafeStatus;
  setCafeStatus: Dispatch<SetStateAction<CafeStatus>>;
}

const CafeInfo: React.FC<CafeInfoProps> = ({ cafe }: CafeInfoProps) => {
  return (
    <div>
      <li>店名: {cafe.name}</li>
      <li>住所: {cafe.address}</li>
      <li>アクセス: {cafe.access}</li>
    </div>
  );
};

const UpdateCafe: React.FC<UpdateCafeProps> = ({
  cafe,
  setCafe,
  cafeStatus,
  setCafeStatus,
}: UpdateCafeProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Cafe>();

  const onSubmit = (cafe: Cafe) => {
    setCafe(cafe);

    let tables: Table[] = [];
    for (let i = 0; i < cafe.tableNum; i++) {
      const table: Table = {
        tableName: `No.${i + 1}`,
        empty: true,
      };
      tables.push(table);
    }

    cafeStatus.tables = tables;
    setCafeStatus(cafeStatus);
  };

  return (
    <div>
      <li>店舗情報</li>
      <ul>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>店名</label>
            <input
              type="text"
              maxLength={30}
              size={30}
              defaultValue={cafe.name}
              {...register("name")}
            ></input>
          </div>
          <div>
            <label>住所</label>
            <input
              type="text"
              maxLength={30}
              size={30}
              defaultValue={cafe.address}
              {...register("address")}
            ></input>
          </div>
          <div>
            <label>アクセス</label>
            <input
              type="text"
              maxLength={30}
              size={30}
              defaultValue={cafe.access}
              {...register("access")}
            ></input>
          </div>
          <div>
            <label>座席数</label>
            <input
              type="text"
              maxLength={30}
              size={30}
              defaultValue={cafe.tableNum}
              {...register("tableNum")}
            ></input>
          </div>
          <div>
            <label>備考</label>
            <input
              type="text"
              maxLength={30}
              size={30}
              defaultValue={cafe.note ? cafe.note : ""}
              {...register("note")}
            ></input>
          </div>
          <button type="submit">登録</button>
        </form>
      </ul>
    </div>
  );
};

export { CafeInfo, UpdateCafe };
export type { Cafe };
