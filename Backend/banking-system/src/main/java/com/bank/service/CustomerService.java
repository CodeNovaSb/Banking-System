package com.bank.service;

import com.bank.entity.Customer;
import com.bank.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // GET ALL customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // GET customer by ID
    public Optional<Customer> getCustomerById(Integer id) {
        return customerRepository.findById(id);
    }

    // CREATE new customer
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // UPDATE existing customer
    public Customer updateCustomer(Integer id, Customer updatedCustomer) {
        Optional<Customer> existing = customerRepository.findById(id);

        if (existing.isPresent()) {
            Customer customer = existing.get();
            customer.setName(updatedCustomer.getName());
            customer.setDob(updatedCustomer.getDob());
            customer.setGender(updatedCustomer.getGender());
            customer.setPhone(updatedCustomer.getPhone());
            customer.setEmail(updatedCustomer.getEmail());
            customer.setAddress(updatedCustomer.getAddress());
            return customerRepository.save(customer);
        } else {
            return null;
        }
    }

    // DELETE customer
    public boolean deleteCustomer(Integer id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}