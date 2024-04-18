import * as SQLite from "expo-sqlite";
import Item from "../Interfaces/Item";

let db = SQLite.openDatabase('database.db');

db.transaction(tx => {
  //tx.executeSql("DROP TABLE produits");
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS produits (id integer primary key not null, name text not null, price number not null, amount number not null)'
  );
});


  /**
   * Ajouter item
   * */ 
  async function add(item:Item){
      // is text empty?
      if (item.id === null || item.id === "") {
        return false;
      }
      db.transaction(
        (tx) => {
          tx.executeSql("INSERT OR REPLACE INTO produits (id, name, price, amount) VALUES (?, ?, ?, ?)", [item.id, item.name, item.price, item.amount]);
        },
        null
      );
  };

  async function deleteAll(){
    db.transaction(
      (tx) => {
        tx.executeSql("DELETE FROM produits");
      }
    );
  };

  /** 
   * Maj item
  */
  async function updateItem(item:Item){
    let sql = 'UPDATE produits SET name = ?, price = ?, amount = ? WHERE id = ?';
    let params = [item.name, item.price, item.amount, item.id];

    db.transaction(
      (tx) => {
        tx.executeSql(sql, params, (resultSet) => {
            console.log("Success", "Updated successfully");
        }, (error) => {
            console.log("Update failed : ",error);
        });
      }
    );
  };

  /**
   * Supprimer item par id
   * @param item 
   */
  async function deleteItem(item:Item){
    let sql = 'DELETE FROM produits WHERE id = ?';
    let params = [item.id];
    db.transaction(
      (tx) => {
        tx.executeSql(sql, params, (resultSet) => {
            console.log("Success, ", "Item deleted");
        }, (error) => {
            console.log("Delete failed : ",error);
        });
      }
    );
  };

  /**
   * récupérer tous les items dans le panier
   * @returns 
   */
  async function getAll():Promise<any[]>{
    return new Promise((resolve, reject) => {
      db.transaction(
          (tx) => {
            tx.executeSql("SELECT * FROM produits", [],
            (tx, results) => {
              resolve(results.rows._array);
            },
            function (error) {
                reject(false);
                throw new Error(
                    'Error getAll: ' + JSON.stringify(error)
                );
            });
          },
          function (error) {
              reject(undefined);
              throw new Error('error: ' + error.message);
          },
      );
    });
    
  };

export {add, getAll,deleteAll, deleteItem, updateItem};
