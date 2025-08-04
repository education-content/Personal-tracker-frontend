export default function Register() {
  return (
    <div className="max-w-sm mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form>
        <input type="text" placeholder="Name" className="w-full mb-4 p-2 border" />
        <input type="email" placeholder="Email" className="w-full mb-4 p-2 border" />
        <input type="password" placeholder="Password" className="w-full mb-4 p-2 border" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}
