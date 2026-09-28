import { useState, useEffect } from "react";

function App() {
  const [expenses, setExpenses] = useState<any[]>(() => {
    const saved = localStorage.getItem("myExpenses");
    return saved? JSON.parse(saved) : [];
  });
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [budget] = useState(5000);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => { localStorage.setItem("myExpenses", JSON.stringify(expenses)); }, [expenses]);

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const filteredExpenses = filter === "All"? expenses : expenses.filter(e => e.category === filter);

  // GRAPH DATA - Category wise total
  const categories = ["Food","Shopping","Travel","Bills","Other"];
  const categoryTotals = categories.map(cat => ({
    cat,
    total: expenses.filter(e=>e.category===cat).reduce((s,e)=>s+Number(e.amount),0),
    color: cat==="Food"?"#ff7675":cat==="Shopping"?"#74b9ff":cat==="Travel"?"#55efc4":cat==="Bills"?"#ffeaa7":"#a29bfe"
  }));

  const handleAddOrUpdate = () => {
    if (!name ||!amount) return;
    if (editingId) {
      setExpenses(expenses.map(e => e.id === editingId? {...e, name, amount: Number(amount), category } : e));
      setEditingId(null);
    } else {
      // DATE ADD CHEYATAM NEW
      const today = new Date().toLocaleDateString();
      setExpenses([...expenses, { id: Date.now(), name, amount: Number(amount), category, date: today }]);
    }
    setName(""); setAmount("");
  };

  const startEdit = (e: any) => { setName(e.name); setAmount(e.amount); setCategory(e.category); setEditingId(e.id); };

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h2>💸 Expense Tracker</h2>
        <div style={{ background: "#2f3542", padding: "10px", borderRadius: "10px", marginBottom: "10px", textAlign: "center" }}>
          Spent: ₹{total} / ₹{budget}
          <div style={{height:"10px", background:"#444", borderRadius:"5px", marginTop:"5px"}}>
            <div style={{width:`${Math.min(100, (total/budget)*100)}%`, height:"100%", background: total>budget?"red":"#6c5ce7", borderRadius:"5px"}}></div>
          </div>
        </div>

        {/* GRAPH NEW */}
        {total>0 && (
          <div style={{background:"#2f3542", padding:"10px", borderRadius:"10px", marginBottom:"15px"}}>
            <h4 style={{margin:"0 0 10px 0", fontSize:"14px"}}>📊 Category Report</h4>
            {categoryTotals.filter(c=>c.total>0).map(c=>(
              <div key={c.cat} style={{margin:"5px 0"}}>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:"12px"}}>
                  <span>{c.cat}</span><span>₹{c.total} ({Math.round((c.total/total)*100)}%)</span>
                </div>
                <div style={{height:"8px", background:"#444", borderRadius:"5px"}}>
                  <div style={{width:`${(c.total/total)*100}%`, height:"100%", background:c.color, borderRadius:"5px"}}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{width:"100%", padding:"8px", margin:"5px 0"}}/>
        <input placeholder="Amount" type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{width:"100%", padding:"8px", margin:"5px 0"}}/>
        <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:"100%", padding:"8px"}}>
          <option>Food</option><option>Shopping</option><option>Travel</option><option>Bills</option><option>Other</option>
        </select>
        <button onClick={handleAddOrUpdate} style={{width:"100%", padding:"10px", background: editingId? "#00b894" : "#6c5ce7", border:"none", color:"white", borderRadius:"5px", marginTop:"5px"}}>
          {editingId? "✅ Update" : "+ Add Expense"}
        </button>

        <div style={{ display: "flex", gap: "5px", marginTop: "15px", flexWrap: "wrap" }}>
          {["All","Food","Shopping","Travel","Bills","Other"].map(f => (
            <button key={f} onClick={()=>setFilter(f)} style={{ padding: "5px 10px", borderRadius: "15px", border: "none", background: filter===f? "#6c5ce7" : "#2f3542", color: "white", cursor: "pointer", fontSize: "12px" }}>{f}</button>
          ))}
        </div>

        <div style={{ marginTop:"10px" }}>
          {filteredExpenses.map((e:any) => (
            <div key={e.id} style={{ display:"flex", justifyContent:"space-between", padding:"8px", background:"#2f3542", margin:"5px 0", borderRadius:"5px", fontSize:"14px" }}>
              <span>{e.name} <small style={{color:"#a29bfe"}}>{e.category}</small> - ₹{e.amount} <small style={{color:"#888"}}>{e.date||""}</small></span>
              <span><span onClick={()=>startEdit(e)} style={{cursor:"pointer", marginRight:"10px"}}>✏️</span><span onClick={()=>setExpenses(expenses.filter((i:any)=>i.id!==e.id))} style={{cursor:"pointer", color:"red", fontWeight:"bold"}}>X</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;