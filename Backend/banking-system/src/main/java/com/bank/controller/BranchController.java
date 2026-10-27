package com.bank.controller;

import com.bank.entity.Branch;
import com.bank.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "*")
public class BranchController {

    @Autowired
    private BranchService branchService;

    // GET all branches
    @GetMapping
    public ResponseEntity<List<Branch>> getAllBranches() {
        List<Branch> branches = branchService.getAllBranches();
        return ResponseEntity.ok(branches);
    }

    // GET branch by ID
    @GetMapping("/{id}")
    public ResponseEntity<Branch> getBranchById(@PathVariable Integer id) {
        Optional<Branch> branch = branchService.getBranchById(id);

        if (branch.isPresent()) {
            return ResponseEntity.ok(branch.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // CREATE new branch
    @PostMapping
    public ResponseEntity<Branch> createBranch(@RequestBody Branch branch) {
        Branch created = branchService.createBranch(branch);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // UPDATE branch
    @PutMapping("/{id}")
    public ResponseEntity<Branch> updateBranch(
            @PathVariable Integer id,
            @RequestBody Branch branch) {

        Branch updated = branchService.updateBranch(id, branch);

        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE branch
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBranch(@PathVariable Integer id) {
        boolean deleted = branchService.deleteBranch(id);

        if (deleted) {
            return ResponseEntity.ok("Branch deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}