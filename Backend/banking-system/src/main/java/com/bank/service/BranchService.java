package com.bank.service;

import com.bank.entity.Branch;
import com.bank.repository.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BranchService {

    @Autowired
    private BranchRepository branchRepository;

    // GET ALL branches
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    // GET branch by ID
    public Optional<Branch> getBranchById(Integer id) {
        return branchRepository.findById(id);
    }

    // CREATE new branch
    public Branch createBranch(Branch branch) {
        return branchRepository.save(branch);
    }

    // UPDATE existing branch
    public Branch updateBranch(Integer id, Branch updatedBranch) {
        Optional<Branch> existing = branchRepository.findById(id);

        if (existing.isPresent()) {
            Branch branch = existing.get();
            branch.setBranchName(updatedBranch.getBranchName());
            branch.setCity(updatedBranch.getCity());
            return branchRepository.save(branch);
        } else {
            return null;
        }
    }

    // DELETE branch by ID
    public boolean deleteBranch(Integer id) {
        if (branchRepository.existsById(id)) {
            branchRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}