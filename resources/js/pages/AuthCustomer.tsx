import { useState } from "react";
import { X, Building2, Route } from "lucide-react";
import { NewUser } from '../../../types';
import axios from "axios";
import { url } from "inspector";

const KENYA_COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi",
  "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga",
  "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu"
];

export default function AuthCustomer() {
  // ✅ Move all useState hooks INSIDE the component
  const [newUser, setNewUser] = useState<NewUser>({
    id: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    business_name: '',
    role: 'CUSTOMER',
    kra_pin: '',
    county: '',
    user_type: 'PHARMACY',
    isVerified: false,
  });

  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('PHARMACY');

  // ✅ Move handler functions INSIDE the component
  const handleNewUser = async () => {
    const missingFields = [];
    if (!newUser.business_name) missingFields.push('Business Name');
    if (!newUser.kra_pin) missingFields.push('KRA PIN');
    if (!newUser.email) missingFields.push('Email');
    if (!newUser.password) missingFields.push('Password');
    if (!newUser.password_confirmation) missingFields.push('Password Confirmation');

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields:\n\n${missingFields.map(field => `• ${field}`).join('\n')}`);
      return;
    }

    try {
      const response = await axios.post('/register', newUser);
      alert(`Your Account Under ${newUser.business_name} was created`);

    } catch (error: any) {
      console.error('Registration Error:', error.response);
      alert(`Registration Failed: ${error.response?.data?.message || error.message}`);
    }
  };

    const handleLogin = async () => {
        if (!newUser.email || !newUser.password) {
            alert('Please enter both email and password to sign in.');
            return;
        }

        try {
            const response = await axios.post('/authlogin', {
                email: newUser.email,
                password: newUser.password
            });

            if (response.data.success) {
                alert('Login successful!');

                window.location.href = response.data.redirect;
            }else{
                alert('Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message
                    || 'Login failed. Please try again.';
                alert(`Login Failed: ${errorMessage}`);
            } else {
                console.error('Unexpected error:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity"></div>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button className="text-slate-400 hover:text-slate-500">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col md:flex-row h-full">
            <div className="hidden md:flex md:w-5/12 bg-[#0d9488] p-8 flex-col justify-between text-white">
              <div>
                <Building2 className="h-10 w-10 mb-4 text-primary-200" />
                <h3 className="text-2xl font-bold mb-2">Join KrysLink</h3>
                <p className="text-primary-100 text-sm">
                  Access Kenya's largest network of verified pharmaceutical suppliers.
                </p>
              </div>
              <div className="space-y-4 text-xs text-primary-200">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                  Bulk Pricing
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                  Next Day Delivery
                </div>
              </div>
            </div>
            <div className="w-full md:w-7/12 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
              </div>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  isLogin ? handleLogin() : handleNewUser();
                }}
              >
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <button
                        type="button"
                        onClick={() => {
                          setUserType('PHARMACY');
                          setNewUser({ ...newUser, user_type: 'PHARMACY' });
                        }}
                        className={`py-2 px-4 text-sm font-medium rounded-md text-center border ${
                          userType === 'PHARMACY'
                            ? 'border-[#0d9488] bg-teal-50 text-[#0d9488]'
                            : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Pharmacy
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserType('HOSPITAL');
                          setNewUser({ ...newUser, user_type: 'HOSPITAL' });
                        }}
                        className={`py-2 px-4 text-sm font-medium rounded-md text-center border ${
                          userType === 'HOSPITAL'
                            ? 'border-[#0d9488] bg-teal-50 text-[#0d9488]'
                            : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Hospital
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newUser.business_name}
                      onChange={(e) => setNewUser({ ...newUser, business_name: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      placeholder="Business Name"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={newUser.kra_pin}
                        onChange={(e) => setNewUser({ ...newUser, kra_pin: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        placeholder="KRA PIN"
                        required
                      />
                      <select
                        value={newUser.county}
                        onChange={(e) => setNewUser({ ...newUser, county: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      >
                        <option value="">Select County</option>
                        {KENYA_COUNTIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Email"
                  required
                />
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Password"
                  required
                />
                {!isLogin && (
                  <input
                    type="password"
                    value={newUser.password_confirmation}
                    onChange={(e) => setNewUser({ ...newUser, password_confirmation: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Confirm Password"
                    required
                  />
                )}
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e]"
                >
                  {isLogin ? 'Sign In' : 'Submit for Verification'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-[#0d9488] hover:text-[#0f766e] text-sm"
                >
                  {isLogin ? 'Register Now' : 'Sign In'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
